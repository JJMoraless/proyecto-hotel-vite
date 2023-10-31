const token = localStorage.getItem("token")
if(!token) {
    window.location.href = "login.html"
}
export * from './navbar';
export * from './sidebar';
