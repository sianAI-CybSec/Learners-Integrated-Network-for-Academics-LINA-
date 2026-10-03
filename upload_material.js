document.getElementById('file-upload').addEventListener('change', function(e) {
    e.preventDefault();
    const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
    document.getElementById('file-name').textContent = fileName;
});
document.getElementById('reset-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const form = document.getElementById('upload-form');
    document.getElementById('file-name').textContent = 'No file chosen';
    document.getElementById('file-upload').value = '';
    form.reset();
});
document.getElementById('upload-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('file-upload');
    const form = document.getElementById('upload-form');
    if (form.checkValidity() && fileInput.files.length > 0) {
        alert('LINA: File uploaded successfully!');
        console.log('LINA: File uploaded successfully!');
        form.reset();
        document.getElementById('file-name').textContent = 'No file chosen';
    } else {
        alert('LINA: Please fill out all required fields and select a file before uploading.');
        console.log('LINA: Please fill out all required fields and select a file before uploading.');
    }
});
    