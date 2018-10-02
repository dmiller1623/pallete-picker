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
}

const savePalette = async () => {
  const newPalette = { colors: ['#BC9097', '#EF6789', '#78EEC4', '#9A4567', '#CDB889'] };

  const url = 'http://localhost:3000/api/v1/palettes';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      newPalette
    })
  })
  await console.log(response.json())
}

const addNewProject = (event) => {
  event.preventDefault()
  const projectName = $('.project-name').val()
  console.log(projectName)
}

$('.save-project-button').on('click', addNewProject)
$('.save-palette-button').on('click', savePalette)
$('.lock-button').on('click', lockColor)
$('.new-palette-button').on('click', getColors)
