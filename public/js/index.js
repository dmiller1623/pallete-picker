let currentProjects;

const getNewColor = () => {
  let codeOptions = '0123456789ABCDEF'.split('');
  var color = '#'
  for(var i = 0; i < 6; i++) {
    color += codeOptions[Math.round(Math.random() * 15)]
  }
  return color
}

const getNewPalette = () => {
  let colorClasses = ['.color-one', '.color-two', '.color-three', '.color-four', '.color-five']
  colorClasses.forEach(colorClass => {
    if ($(`${colorClass}`).hasClass('locked')) {
      return 
    } else {
      let newColor = getNewColor()
      $(`${colorClass}`).css('background-color', newColor)
      $(`${colorClass}`).children().children('.color-code').text(newColor)
    }
  })
}

const lockColor = (event) => {
  ($(event.target.parentElement.parentElement)).toggleClass('locked')
}

const getPalettes = async () => {
  const response = await fetch('/api/v1/palettes')
  const palettes = await response.json();
  return palettes
}

const displayProjects = async () => {
  const projectDisplay = $('.projects-nav')
  projectDisplay.empty();
  const projectOptions = $('.project-option-display')
  projectOptions.empty();
  const response = await fetch('/api/v1/projects')
  const projects = await response.json()
  const palettes = await getPalettes();
  currentProjects = projects;
  const projectsAndPalettes = projects.map(project => {
    const orderedPalettes = palettes.filter(palette => {
      return palette.project_id === project.id
    })
    return {...project, palettes: orderedPalettes}
  })
  projectsAndPalettes.forEach(project => {
    projectDisplay.append(`
    <div class='database-projects=header'>
      <h1>${project.name}</h1>
    </div>
    `)
    project.palettes.forEach(palette => {
      projectDisplay.append(`
      <div class='database-palettes' id=${palette.id}>
        <div class='data-colors'>
          <section class='data-color-one' id=${palette.color_one} style=background-color:${palette.color_one}></section>
          <section class='data-color-two' id=${palette.color_two} style=background-color:${palette.color_two}></section>
          <section class='data-color-three' id=${palette.color_three} style=background-color:${palette.color_three}></section>
          <section class='data-color-four' id=${palette.color_four} style=background-color:${palette.color_four}></section>
          <section class='data-color-five' id=${palette.color_five} style=background-color:${palette.color_five}></section>
        </div>
        <div class='data-lower-section'>
          <h1>${palette.name}</h1>
          <button class='delete-palette-button'>delete</button>
        </div>
      </div>
      `)
    })
  })
  projects.forEach(project => {
    projectOptions.append(`
    <option value=${project.name}>${project.name}</option>
    `)
  })

}

const addNewProject = async () => {
  const projectNames = currentProjects.map(project => project.name)
  let projectName = {name: $('.project-name').val()}; 
  if (projectNames.includes(projectName.name)) {
    return alert(`project name ${projectName} already exsists`)
  } else {
  try {
    const response = await fetch('/api/v1/projects', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...projectName
      })
    });
    displayProjects()
    return await response.json()
  } catch (error) {
    throw new Error(error.message)
  }
}
  
}

const changeProject = async() => {
  let currentProject = $('.project-option-display option:selected').text()
  const response = await fetch('/api/v1/projects')
  const projects = await response.json()
  const foundProject = projects.find(project => {
    return project.name === currentProject
  })
  return foundProject.id
}

const addNewPalette = async () => {
  let projectId = await changeProject()
  let newPalette = {
    name: $('.palette-name').val(),
    color_one: $('.code-one').text(),
    color_two: $('.code-two').text(),
    color_three: $('.code-three').text(),
    color_four: $('.code-four').text(),
    color_five: $('.code-five').text(),
  }
  try {
    const response = await fetch(`/api/v1/projects/${projectId}/palettes`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...newPalette
      })
    });
    displayProjects();
    return await response.json()
  } catch (error) {
    throw new Error(error.message);
  }
};

const deletePalette = async(event) => {
  if (event.target.className === 'delete-palette-button') {
    let id = event.target.parentElement.parentElement.id;
    try {
      await fetch(`/api/v1/palettes/${id}`, {
        method: 'DELETE'
      }); 
    } catch (error) {
      throw new Error(error.meassage)
    }
    displayProjects()
  }
  return 
}

const displaySelectedPalette = (event) => {
  if (event.target.parentElement.className === 'data-colors') {
    const colorOne = event.target.parentElement.children[0].id
    const colorTwo = event.target.parentElement.children[1].id
    const colorThree = event.target.parentElement.children[2].id
    const colorFour = event.target.parentElement.children[3].id
    const colorFive = event.target.parentElement.children[4].id
    $('.color-one').css('background-color', colorOne)
    $('.color-two').css('background-color', colorTwo)
    $('.color-three').css('background-color', colorThree)
    $('.color-four').css('background-color', colorFour)
    $('.color-five').css('background-color', colorFive)
  }
}

$(document).ready(() =>{
  getNewPalette();
  displayProjects();
})

$('.palette-name').on('click', changeProject)
$('.projects-nav').on('click', deletePalette)
$('.projects-nav').on('click', displaySelectedPalette)
$('.save-project-button').on('click', addNewProject)
$('.save-palette-button').on('click', addNewPalette)
$('.lock-button').on('click', lockColor)
$('.new-palette-button').on('click', getNewPalette)

