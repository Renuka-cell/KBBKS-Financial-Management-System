<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Options extends ResourceController
{
    public function handle($any = null)
    {
        // Return empty 200 response for CORS preflight.
        return $this->respond('', 200);
    }
}
