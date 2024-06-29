

const handleUserProfile=()=>{

    window.location.href='../pages/userprofile.html';

}
const handleProfileLogOut=()=>{

    localStorage.removeItem("token");
    window.location.href='../pages/index.html';

}
const handleProfileHome=()=>{

    window.location.href='../pages/index.html';

}
const handleProfileCreate=()=>{

    window.location.href='../pages/create.html';

}

