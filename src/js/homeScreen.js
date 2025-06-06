const navNoL = document.getElementById("noLogin")
const navL = document.getElementById("login")

function logged(){
    const isLogged = localStorage.getItem('token')
    if (isLogged != null){
        navNoL.style.display = 'none'
        navL.style.display = 'block'
    } else {
        navNoL.style.display = 'block'
        navL.style.display = 'none'
    }
}

logged()