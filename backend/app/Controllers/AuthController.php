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
        
        $name = $input['name'] ?? null;
        $email = $input['email'] ?? null;
        $password = $input['password'] ?? null;
        $role = $input['role'] ?? null;

        if (!$name || !$email || !$password || !$role) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'All fields are required'
            ]);
        }

        $userModel = new UserModel();

        if ($userModel->where('email', $email)->first()) {
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Email already registered'
            ]);
        }

        $userModel->insert([
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_DEFAULT),
            'role' => $role
        ]);

        return $this->response->setJSON([
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
            return $this->response->setJSON([
                'status'  => false,
                'message' => 'Email and password are required'
            ]);
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response->setJSON([
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
            'status' => true,
            'message' => 'Login successful',
            'token' => $token,
            'role' => $user['role'],
            'user_id' => $user['user_id'],
            'name' => $user['name']
        ]);
    }
}
