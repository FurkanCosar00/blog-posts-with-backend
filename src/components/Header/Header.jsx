export default function Header() {
    return (
        <header className="header">
            <div className="pageLogo">
                <h2>Furkan Cosar</h2>
                <p>Blog Site</p>
            </div>

            <div className="pageLinks">
                <a>About Me</a>
                <a>Contact Us</a>
                <input type="text" placeholder="Search..."/>
            </div>
        </header>
    )
}