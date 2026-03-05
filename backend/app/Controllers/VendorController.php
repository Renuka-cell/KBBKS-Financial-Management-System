<?php

namespace App\Controllers;

use App\Models\VendorModel;

class VendorController extends BaseController
{
    public function index()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized access'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant', 'Viewer'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Insufficient role permission'
            ]);
        }

        $model = new VendorModel();
        $vendors = $model->findAll();

        // ✅ FULL URL + DEFAULT LOGO
        foreach ($vendors as &$vendor) {

            if (!empty($vendor['logo'])) {
                $vendor['logo'] = base_url($vendor['logo']);
            } else {
                $vendor['logo'] = base_url('uploads/vendor_logos/default.png');
            }
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $vendors
        ]);
    }

    public function create()
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized access'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin or Accountant can create vendors'
            ]);
        }

        if ($this->request->getHeaderLine('Content-Type') === 'application/json') {
            $data = $this->request->getJSON(true);
        } else {
            $data = $this->request->getPost();
        }

        if (empty($data['vendor_name'])) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Vendor name is required'
            ]);
        }

        $file = $this->request->getFile('logo');
        $logoPath = null;

        if ($file && $file->isValid() && !$file->hasMoved()) {

            // log path constants for debugging
            log_message('debug', 'VendorController:create FCPATH=' . FCPATH);
            log_message('debug', 'VendorController:create TMP name=' . $file->getTempName());

            // ✅ FILE SIZE LIMIT (2MB)
            if ($file->getSize() > 2 * 1024 * 1024) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status' => false,
                    'message' => 'File size must be less than 2MB'
                ]);
            }

            // ✅ ALLOWED EXTENSIONS
            $allowedExtensions = ['png', 'jpg', 'jpeg'];
            $extension = strtolower($file->getExtension());

            if (!in_array($extension, $allowedExtensions)) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status' => false,
                    'message' => 'Only PNG, JPG, JPEG files allowed'
                ]);
            }

            $newName = $file->getRandomName();
            $targetDir = FCPATH . 'uploads/vendor_logos/';
            if (!is_dir($targetDir)) {
                @mkdir($targetDir, 0755, true);
            }
            $moved = $file->move($targetDir, $newName);
            log_message('debug', 'VendorController:create move result=' . ($moved ? 'success' : 'failure'));

            $logoPath = 'uploads/vendor_logos/' . $newName;
        }

        $data['logo'] = $logoPath;

        $model = new VendorModel();

        if (!$model->insert($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => false,
                'errors' => $model->errors()
            ]);
        }

        return $this->response->setJSON([
            'status'    => true,
            'message'   => 'Vendor created successfully',
            'vendor_id' => $model->getInsertID()
        ]);
    }

    public function update($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized access'
            ]);
        }

        if (!$this->checkRole(['Admin', 'Accountant'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin or Accountant can update vendors'
            ]);
        }

        if ($this->request->getHeaderLine('Content-Type') === 'application/json') {
            $data = $this->request->getJSON(true);
        } else {
            $data = $this->request->getPost();
        }

        // Normalize to plain array so array functions behave predictably.
        if (!is_array($data)) {
            $data = (array) $data;
        }

        // Log the raw incoming data for debugging (will show if 500 occurs again).
        log_message('debug', 'VendorController:update payload -> ' . print_r($data, true));

        // Remove logo key entirely; we only ever set it ourselves when a file
        // upload is valid. If the client submitted it as an empty value or
        // array (which CI does when an empty file input is present) we want
        // it gone to avoid bad SQL syntax.
        if (array_key_exists('logo', $data)) {
            unset($data['logo']);
        }

        if (empty($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'No data provided to update'
            ]);
        }

        $model = new VendorModel();
        $existingVendor = $model->find($id);

        if (!$existingVendor) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Vendor not found'
            ]);
        }

        $file = $this->request->getFile('logo');

        if ($file && $file->isValid() && !$file->hasMoved()) {

            log_message('debug', 'VendorController:update incoming file temp=' . $file->getTempName());

            if ($file->getSize() > 2 * 1024 * 1024) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status' => false,
                    'message' => 'File size must be less than 2MB'
                ]);
            }

            $allowedExtensions = ['png', 'jpg', 'jpeg'];
            $extension = strtolower($file->getExtension());

            if (!in_array($extension, $allowedExtensions)) {
                return $this->response->setStatusCode(400)->setJSON([
                    'status' => false,
                    'message' => 'Only PNG, JPG, JPEG files allowed'
                ]);
            }

            // ✅ DELETE OLD LOGO
            if (!empty($existingVendor['logo']) && file_exists(FCPATH . $existingVendor['logo'])) {
                unlink(FCPATH . $existingVendor['logo']);
            }

            $newName = $file->getRandomName();
            $targetDir = FCPATH . 'uploads/vendor_logos/';
            if (!is_dir($targetDir)) {
                @mkdir($targetDir, 0755, true);
            }
            $moved = $file->move($targetDir, $newName);
            log_message('debug', 'VendorController:update move result=' . ($moved ? 'success' : 'failure'));

            $data['logo'] = 'uploads/vendor_logos/' . $newName;
        }

        // Filter out any empty strings/nulls/empty arrays that may have
        // slipped through – this prevents CI from generating `field = ()`
        // or other weird bindings.
        $data = array_filter($data, function ($v) {
            if (is_array($v)) {
                return !empty($v);
            }
            return $v !== '' && $v !== null;
        });

        if (!$model->update($id, $data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => false,
                'errors' => $model->errors()
            ]);
        }

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Vendor updated successfully'
        ]);
    }

    public function delete($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized access'
            ]);
        }

        if (!$this->checkRole(['Admin'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin can delete vendors'
            ]);
        }

        $model = new VendorModel();
        $vendor = $model->find($id);

        // ✅ DELETE LOGO WHEN VENDOR DELETED
        if (!empty($vendor['logo']) && file_exists(FCPATH . $vendor['logo'])) {
            unlink(FCPATH . $vendor['logo']);
        }

        $model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Vendor deleted successfully'
        ]);
    }
}