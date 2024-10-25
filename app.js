const fs = require("fs");
const path = require("path");
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// Membuat folder baru
app.makeFolder = () => {
    rl.question("Masukkan Nama Folder: ", (folderName) => {
        fs.mkdir(path.join(__dirname, folderName), (err) => {
            if (err) throw err;
            console.log("Folder berhasil dibuat");
            rl.close();
        });
    });
};

// Membuat file baru dengan isi
app.makeFile = () => {
    rl.question("Masukkan Nama Folder: ", (folder) => {
        rl.question("Masukkan Nama File: ", (fileName) => {
            rl.question("Masukkan Ekstensi File: ", (ext) => {
                rl.question("Masukkan Isi File: ", (content) => {
                    fs.writeFileSync(path.join(folder, `${fileName}.${ext}`), content);
                    console.log(`File ${fileName}.${ext} berhasil dibuat di folder ${folder}`);
                    rl.close();
                });
            });
        });
    });
};

// Membaca isi folder
app.readFolder = () => {
    rl.question("Masukkan nama folder yang ingin dibaca: ", (folderName) => {
        const folderPath = path.join(__dirname, folderName);
        fs.readdir(folderPath, (err, files) => {
            if (err) throw err;

            const fileDetails = files.map((file) => {
                const stats = fs.statSync(path.join(folderPath, file));
                return {
                    namaFile: file,
                    extensi: path.extname(file).substring(1),
                    jenisFile: ['jpg', 'png'].includes(path.extname(file).substring(1)) ? 'gambar' : 'text',
                    tanggalDibuat: stats.birthtime.toISOString().split('T')[0],
                    ukuranFile: `${(stats.size / 1024).toFixed(2)}kb`
                };
            });

            console.log(JSON.stringify(fileDetails, null, 2));
        });
        rl.close();
    });
};

// Membaca isi file
app.readFile = () => {
    rl.question("Masukkan nama file yang ingin dibaca: ", (fileName) => {
        const filePath = path.join(__dirname, fileName);
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error("Error:", err.message);
                return;
            }
            console.log(`Isi dari file ${fileName}:\n\n${data}`);
        });
        rl.close();
    });
};

// Merapikan file sesuai ekstensi
app.extSorter = () => {
    const unorganizedFolder = path.join(__dirname, 'unorganize_folder');

    fs.readdir(unorganizedFolder, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
            const ext = path.extname(file).substring(1);
            const targetFolder = ['jpg', 'png'].includes(ext) ? 'image' : 'text';

            const targetPath = path.join(__dirname, targetFolder);
            if (!fs.existsSync(targetPath)) {
                fs.mkdirSync(targetPath);
            }

            fs.rename(
                path.join(unorganizedFolder, file),
                path.join(targetPath, file),
                (err) => {
                    if (err) throw err;
                    console.log(`${file} berhasil dipindahkan ke folder ${targetFolder}`);
                }
            );
        });
    });
};

module.exports = app;