document.getElementById('file-upload').addEventListener('change', function(e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
    document.getElementById('file-name').textContent = fileName;
});
document.getElementById('reset-btn').addEventListener('click', function(e) {
    const form = document.getElementById('upload-form');
    document.getElementById('file-name').textContent = 'No file chosen';
    document.getElementById('file-upload').value = '';
    form.reset();
});
document.getElementById('upload-btn').addEventListener('click', function(e) {
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
document.addEventListener("DOMContentLoaded", function() {
    const tagsSelect = document.getElementById('tags') || document.querySelector('select[multiple]');
    
    if (tagsSelect) {
        tagsSelect.querySelectorAll('option').forEach(function(option) {
            option.addEventListener('mousedown', function(e) {
                e.preventDefault(); 
                
                const currentScrollTop = tagsSelect.scrollTop;
                
                this.selected = !this.selected; 
                
                tagsSelect.focus();
                
                setTimeout(() => {
                    tagsSelect.scrollTop = currentScrollTop;
                }, 0);
                
                tagsSelect.dispatchEvent(new Event('change'));
                
                return false;
            });
        });
    }
});
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const errorMessage = document.getElementById('errorMessage');
    
    if (!file) {
        return; 
    }

    const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    ];

    const isValidExtension = allowedExtensions.exec(file.name);
    const isValidMime = allowedMimeTypes.includes(file.type);

    if (!isValidExtension || !isValidMime) {
        errorMessage.style.display = 'block';
        event.target.value = ''; 
    } else {
        errorMessage.style.display = 'none';
        console.log('File is valid:', file.name);
    }
});
