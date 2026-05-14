<?php

declare(strict_types=1);

namespace App\HTTP\Files;

use CodeIgniter\HTTP\Exceptions\HTTPException;
use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Arquivo extraído manualmente do raw input em requisições PUT/PATCH multipart.
 *
 * PHP só registra uploads nativos (POST multipart) em is_uploaded_file() e
 * move_uploaded_file(). Para PUT/PATCH, ambas as funções sempre retornam false.
 *
 * Esta subclasse sobrescreve os dois métodos problemáticos:
 *   isValid() → is_file()           em vez de is_uploaded_file()
 *   move()    → rename()            em vez de move_uploaded_file()
 */
class PutUploadedFile extends UploadedFile
{
    public function isValid(): bool
    {
        return $this->error === UPLOAD_ERR_OK && is_file($this->path);
    }

    public function move(string $targetPath, ?string $name = null, bool $overwrite = false): bool
    {
        if ($this->hasMoved)   { return false; }
        if (!$this->isValid()) { return false; }

        $targetPath  = rtrim($targetPath, '/') . '/';
        $targetPath  = $this->setPath($targetPath);
        $name       ??= $this->getName();
        $destination  = $targetPath . $name;

        $moved = @rename($this->path, $destination);
        if (!$moved) {
            $moved = @copy($this->path, $destination);
            if ($moved) { @unlink($this->path); }
        }

        if (!$moved) { return false; }

        @chmod($destination, 0666 & ~umask());

        $this->hasMoved = true;
        $this->path     = $targetPath;
        $this->name     = basename($destination);

        return true;
    }
}
