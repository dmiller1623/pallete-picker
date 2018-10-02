const getNewPalette = () => {
  let codeOptions = '0123456789ABCDEF'.split('');
  var color = '#'
  for(var i = 0; i < 6; i++) {
    color += codeOptions[Math.round(Math.random() * 15)]
  }
  console.log(color)
  return color
}

const getColors = () => {
  let colorClasses = ['.color-one', '.color-two', '.color-three', '.color-four', '.color-five']
  colorClasses.forEach(colorClass => {
    if ($(`${colorClass}`).hasClass('locked')) {
      return 
    } else {
      $(`${colorClass}`).css('background-color', getNewPalette())
    }
  })
}

const lockColor = (event) => {
  ($(event.target.parentElement)).toggleClass('locked')
  console.log(event.target.parentElement)

}

$('.lock-button').on('click', lockColor)
$('.new-palette-button').on('click', getColors)
