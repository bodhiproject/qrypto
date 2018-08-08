const onConfirmed = () => {
  console.log('confirmed');
};

const onCancelled = () => {
  console.log('cancelled');
};

window.onload = () => {
  document.getElementById('button-confirm').addEventListener('click', onConfirmed);
  document.getElementById('button-cancel').addEventListener('click', onCancelled);
}
