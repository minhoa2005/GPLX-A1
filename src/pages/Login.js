import { useContext, useEffect, useState } from "react"
import { userContext } from "../userContext"
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_USER = "http://localhost:3002/user";

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response =
                await axios.get(`${API_USER}?username=${userName}&password=${password}`);
            console.log(response.data[0])
            if (response.data.length > 0) {
                setUser(response.data[0]);
                if (response.data[0].role === 'admin') {
                    navigate('/admin');
                }
                else {
                    navigate('/');
                }
            }
            else {
                window.alert('Đăng nhập thất bại');
            }
        }
        catch (error) {
            window.alert(error);
            console.log('Error: ', error);
        }
    }

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin');
            }
            else {
                navigate('/');
            }
        }
    }, [])

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0">
                        {/* Header */}
                        <div className="card-header text-center py-4 border-0 bg-">
                            <h3 className="mb-0" style={{ fontWeight: '600' }}>Đăng Nhập</h3>
                        </div>

                        {/* Body */}
                        <div className="card-body p-4">
                            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                {/* Username Field */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>

                                        Tên đăng nhập
                                    </label>
                                    <div className="input-group">

                                        <input
                                            type="text"
                                            className="form-control border-start-0"
                                            placeholder="Nhập tên đăng nhập"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}

                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold" style={{ color: '#2c3e50' }}>
                                        Mật khẩu
                                    </label>
                                    <div className="input-group">

                                        <input
                                            type="password"
                                            className="form-control border-start-0"
                                            placeholder="Nhập mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}

                                            required
                                        />
                                    </div>
                                </div>
                                <div className="d-grid mb-4">
                                    <button
                                        type="submit"
                                        className="btn py-3 bg-primary text-white"
                                    >
                                        Đăng Nhập
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="bg-light border-0 text-center py-3">
                            <p className="mb-0 text-muted">
                                Chưa có tài khoản?
                                <Link
                                    to="/register"
                                    className="ms-2 text-decoration-none fw-semibold"
                                    style={{
                                        color: '#667eea',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = '#764ba2'}
                                    onMouseOut={(e) => e.target.style.color = '#667eea'}
                                >
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;