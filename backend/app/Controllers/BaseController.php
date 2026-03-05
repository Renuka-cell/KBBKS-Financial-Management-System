<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;
use App\Models\UserModel;

/**
 * BaseController
 * Common authentication & role logic
 */
abstract class BaseController extends Controller
{
    protected $currentUser = null;

    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ) {
        parent::initController($request, $response, $logger);
    }

    /**
     * Check token and load logged-in user
     */
    protected function checkToken(): bool
    {
        $authHeader = $this->request->getHeaderLine('Authorization');

        if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
            return false;
        }

        $token = substr($authHeader, 7);

        if (!$token) {
            return false;
        }

        $userModel = new UserModel();
        $user = $userModel->where('token', $token)->first();

        if (!$user) {
            return false;
        }

        // Store logged-in user
        $this->currentUser = $user;

        return true;
    }

    /**
     * Check role of logged-in user
     */
    protected function checkRole(array $allowedRoles): bool
    {
        // Token must be validated first
        if (!$this->currentUser) {
            return false;
        }

        // Role must exist in user record
        if (!isset($this->currentUser['role'])) {
            return false;
        }

        return in_array($this->currentUser['role'], $allowedRoles);
    }
}
