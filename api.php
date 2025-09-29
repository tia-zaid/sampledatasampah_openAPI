<?php
// Mengatur header agar output dianggap sebagai JSON oleh browser
header('Content-Type: application/json');

// Membaca isi file data.json
$jsonData = file_get_contents('data.json');

// Mengirimkan isi JSON ke client (JavaScript)
echo $jsonData;
?>