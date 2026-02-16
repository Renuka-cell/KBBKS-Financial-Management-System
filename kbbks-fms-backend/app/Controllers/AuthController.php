<?php

namespace App\Controllers;

use App\Models\UserModel;

class AuthController extends BaseController
{
    // REGISTER NEW USER
    public function register()
    {
        // Accept both JSON and form data
        $input = $this->request->getJSON(true) ?: $this->request->getPost();
        
        $password = $input['password'] ?? null;
        
        $data = [
            'name'     => $input['name'] ?? null,
            'email'    => $input['email'] ?? null,
            'password' => $password ? password_hash($password, PASSWORD_DEFAULT) : null,
            'role'     => $input['role'] ?? 'User'
        ];

        if (!$data['name'] || !$data['email'] || !$data['password']) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Name, email, and password are required'
            ]);
        }

        $userModel = new UserModel();

        if ($userModel->where('email', $data['email'])->first()) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Email already registered'
            ]);
        }

        $userModel->insert($data);

        return $this->response->setStatusCode(201)->setJSON([
            'status'  => true,
            'message' => 'User registered successfully'
        ]);
    }

    // LOGIN USER
    public function login()
    {
        // Accept both JSON and form data
        $input = $this->request->getJSON(true) ?: $this->request->getPost();
        
        $email    = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        if (!$email || !$password) {
            return $this->response->setStatusCode(400)->setJSON([
                'status'  => false,
                'message' => 'Email and password are required'
            ]);
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response->setStatusCode(401)->setJSON([
                'status'  => false,
                'message' => 'Invalid email or password'
            ]);
        }

        // Generate and store token
        $token = bin2hex(random_bytes(32));

        $userModel->update($user['user_id'], [
            'token' => $token
        ]);

        return $this->response->setJSON([
            'status'  => true,
            'message' => 'Login successful',
            'token'   => $token,
            'role'    => $user['role'],
            'user_id' => $user['user_id'],
            'name'    => $user['name']
        ]);
    }
}
