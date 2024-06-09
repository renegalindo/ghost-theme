(function () {
  // Prevent click event from toggling the checkbox and pinning the menu. Hovering will still open it.
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelector('.menu-icon').addEventListener('click', event => {
      event.preventDefault();
    });
  }
})()