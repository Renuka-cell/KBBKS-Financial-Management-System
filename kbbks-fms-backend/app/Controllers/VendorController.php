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

        return $this->response->setJSON([
            'status' => true,
            'data'   => $model->findAll()
        ]);
    }

    public function view($id)
    {
        if (!$this->checkToken()) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Unauthorized access'
            ]);
        }

        $model = new VendorModel();
        $vendor = $model->find($id);

        if (!$vendor) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Vendor not found'
            ]);
        }

        return $this->response->setJSON([
            'status' => true,
            'data'   => $vendor
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

        if (!$this->checkRole(['Admin'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin can create vendors'
            ]);
        }

        $data = $this->request->getJSON(true);

        if (empty($data['vendor_name'])) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Vendor name is required'
            ]);
        }

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

        if (!$this->checkRole(['Admin'])) {
            return $this->response->setStatusCode(403)->setJSON([
                'status'  => false,
                'message' => 'Only Admin can update vendors'
            ]);
        }

        $data = $this->request->getJSON(true);

        if (empty($data)) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'No data provided to update'
            ]);
        }

        $model = new VendorModel();

        if (!$model->find($id)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status'  => false,
                'message' => 'Vendor not found'
            ]);
        }

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
        $model->delete($id);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Vendor deleted successfully'
        ]);
    }
}
