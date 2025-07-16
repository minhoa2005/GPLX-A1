import { useContext, useState } from "react"
import { userContext } from "../userContext"
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_USER = "http://localhost:3001/user";

const Register = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleRegister = async () => {
        try {
            const check =
                await axios.get(`${API_USER}?username=${userName}&password=${password}`);
            console.log(check.data[0])
            if (check.data.length > 0) {
                window.alert('Tên đăng nhập hoặc mật khẩu đã tồn tại');
                return;
            }
            const response = await axios.post(API_USER, {
                name: name,
                username: userName,
                password: password
            })
            if (!response) {
                window.alert('Đăng ký tài khoản thất bại');
                return;
            }
            window.alert('Đăng ký thành công');
            navigate('/login');
        }
        catch (error) {
            window.alert(error);
            console.log('Error: ', error);
        }
    }

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center" style={{
            minHeight: '100vh',
        }}>
            <div className="row w-100 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-lg border-0" style={{ borderRadius: '25px', overflow: 'hidden' }}>
                        <div className="card-header text-center py-4 border-0" >
                            <div className="mb-3">
                                <i className="fas fa-user-plus fa-3x"></i>
                            </div>
                            <h3 className="mb-0 fw-bold">Đăng Ký</h3>
                            <p className="mb-0 opacity-75">Tạo tài khoản mới</p>
                        </div>

                        <div className="card-body p-4">

                            <div className="mb-4">
                                <label className="form-label fw-semibold">
                                    Họ và tên
                                </label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Nhập họ và tên"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
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
                            <div className="mb-4">
                                <label className="form-label fw-semibold">
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
                                    className="btn py-3 btn-primary text-white"
                                    onClick={handleRegister}
                                >
                                    Đăng Ký
                                </button>
                            </div>
                        </div>
                        <div className="bg-light border-0 text-center py-3">
                            <p className="mb-0 text-muted">
                                Đã có tài khoản?
                                <Link
                                    to="/login"
                                    className="ms-2 text-decoration-none fw-semibold"
                                >
                                    Đăng nhập ngay
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;