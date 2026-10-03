document.getElementById('file-upload').addEventListener('change', function(e) {
  const fileName = e.target.files[0] ? e.target.files[0].name : 'No file chosen';
  document.getElementById('file-name').textContent = fileName;
});
document.getElementById('reset-btn').addEventListener('click', function() {
  document.getElementById('file-name').textContent = 'No file chosen';
  document.getElementById('file-upload').value = '';
});