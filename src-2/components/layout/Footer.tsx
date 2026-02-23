export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="float-end d-none d-sm-inline">Anything you want</div>
      <strong>
        Copyright &copy; {new Date().getFullYear()}{' '}
        <a href="#" className="text-decoration-none">AdminPanel</a>.
      </strong>{' '}
      All rights reserved.
    </footer>
  )
}
