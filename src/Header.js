import { useContext } from "react";
import { userContext } from "./userContext";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);

    return (
        <nav className="navbar navbar-expand-lg shadow-sm">
            <div className="container-fluid px-4">
                <div className="row w-100 align-items-center">
                    <div className="col-12 col-md-8">
                        <div className="d-flex align-items-center">
                            <Link to={'/'} className="text-black" style={{ textDecoration: 'none' }}>
                                <div>
                                    <h2 className="mb-0" >
                                        Ôn Thi GPLX
                                    </h2>
                                    <p className="mb-0">
                                        Hệ thống ôn luyện giấy phép lái xe
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12 col-md-4">
                        <div className="d-flex align-items-center justify-content-md-end gap-3 mt-3 mt-md-0">
                            {user ? (
                                <>
                                    <div className="d-flex align-items-center me-2">
                                        <div
                                            className="me-2 d-flex align-items-center justify-content-center"

                                        >
                                            <i className={`fas ${user.role === 'admin' ? 'fa-user-shield' : 'fa-user'}`}></i>
                                        </div>
                                        <div className="d-none d-sm-block">
                                            <div>
                                                {user.name || user.username || 'User'}
                                            </div>
                                            <div>
                                                {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        {user.role === 'admin' ? (
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => navigate('/admin')}

                                            >
                                                Quản lý
                                            </button>
                                        ) : (
                                            <></>
                                        )}

                                        <button
                                            className="btn btn-sm"
                                            onClick={() => {
                                                setUser(null);
                                                navigate('/');
                                            }}
                                        >

                                            Đăng xuất
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => navigate('/login')}

                                    >
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Đăng nhập
                                    </button>
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => navigate('/register')}

                                    >
                                        <i className="fas fa-user-plus me-2"></i>
                                        Đăng ký
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav >
    );
}

export default Header;