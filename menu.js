fetch('menu.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Menu file not found or failed to load');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('menu-container').innerHTML = data;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('#menu-container a');

    links.forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === currentPage) {
        link.classList.add('active');
      }
    });
  })
  .catch(error => {
    console.error('Error loading menu:', error);
  });
