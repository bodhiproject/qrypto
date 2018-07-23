function hasClass(element: HTMLElement, cls: string) {
  return !!element.className.match(new RegExp( '(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(element: HTMLElement, cls: string) {
  if (!hasClass(element, cls)) {
    element.className += ' ' + cls;
  }
}

function removeClass(element: HTMLElement, cls: string) {
  if (hasClass(element, cls)) {
    element.className = element.className.replace(new RegExp('(\\s|^)' + cls + '(\\s|$)' ), ' ');
  }
}

function getHeight(element: HTMLElement) {
  let height = element.offsetHeight;
  const which = ['Top', 'Bottom'];

  if (height === 0) {
    return 0;
  }

  const styles = window.getComputedStyle(element, null);

  which.forEach((name) => {
    height -= parseFloat(styles['border' + name + 'Width']) || 0;
    height -= parseFloat(styles['padding' + name]) || 0;
  });

  return height;
}

export function showModal(width: number, height: number, style: any = {}, src?: string): Promise<HTMLIFrameElement> {
  const iframe = document.createElement('iframe');

  addClass(iframe, 'qrypto-extension-modal');

  const backdrop = document.createElement('div');
  addClass(backdrop, 'qrypto-extension-modal-backdrop');

  const html = document.documentElement;
  addClass(html, 'qrypto-extension-modal-wrap');

  const body = document.querySelector('body')!;

  const bodyHeight = getHeight(body);

  backdrop.style.height = bodyHeight + 'px';

  Object.assign(iframe.style, {
    ...style,
    border: 'none',
    width: width + 'px',
    height: height + 'px',
    top: 'calc(50vh + ' + (window.pageYOffset - height / 2) + 'px)',
    left: 'calc(50vw + ' + (window.pageXOffset - width / 2) + 'px)',
  });

  body.appendChild(backdrop);
  body.appendChild(iframe);

  if (src) {
    iframe.src = src;

    return new Promise((resolve, reject) => {
      iframe.addEventListener('load', () => resolve(iframe));
      iframe.addEventListener('error', (e) => reject(e));
    });
  }

  return new Promise((resolve) => resolve(iframe));
}

export function closeModal() {
  const iframe = document.querySelector('iframe.qrypto-extension-modal');

  if (iframe) {
    iframe.remove();
    const backdrop = document.querySelector('.qrypto-extension-modal-backdrop');

    if (backdrop) { backdrop.remove(); }

    removeClass(document.documentElement, 'qrypto-extension-modal-wrap');
  }
}
