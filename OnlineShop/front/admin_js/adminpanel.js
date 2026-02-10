
document.querySelectorAll('.menu-item').forEach(item => {
  const targetId = item.getAttribute('data-target');
  if (!targetId) return;

  item.addEventListener('click', () => {
    const menu = document.getElementById(targetId);
    if (!menu) return;

    // بستن بقیه submenu ها
    document.querySelectorAll('.submenu').forEach(sm => {
      if (sm !== menu) sm.style.display = 'none';
    });
    

    // باز یا بسته کردن همین منو
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  });
});