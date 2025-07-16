import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { userContext } from "../userContext";

const API_QUESTION = 'http://localhost:3001/questions'

const EditQ = () => {
    const navigate = useNavigate()
    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams();
    const [question, setQuestion] = useState('');
    const [option, setOption] = useState([]);
    const [answer, setAnswer] = useState('');
    const [image, setImage] = useState('');
    const { user } = useContext(userContext);

    const fetchInfo = async () => {
        try {
            const response = await axios.get(`${API_QUESTION}?id=${id}`);
            if (response.data.length > 0) {
                setQuestion(response.data[0].question_text || '');
                setOption(response.data[0].options || []);
                setAnswer(response.data[0].answer || '');
                setImage(response.data[0].image || '');
            }
        }
        catch (error) {
            window.alert(error);
        }

    }

    useEffect(() => {
        if (user?.role !== 'admin' || !user) {
            window.alert('Bạn không có quyền truy cập');
            navigate('/');
            return;
        }
        if (id) {
            setIsEdit(true);
            fetchInfo();
        }
    }, [id])

    const handleSave = async () => {
        try {
            if (isEdit) {
                if (!question || !option.length || !answer) {
                    window.alert('Vui lòng điền đầy đủ thông tin');
                    return;
                }
                const response = await axios.put(`${API_QUESTION}/${id}`, {
                    question_text: question,
                    options: option,
                    answer: answer,
                    image: image
                });
                if (response) {
                    window.alert('Cập nhật thành công');
                }
            }
            else {
                if (!question || !option.length || !answer) {
                    window.alert('Vui lòng điền đầy đủ thông tin');
                    return;
                }
                const response = await axios.post(API_QUESTION, {
                    question_text: question,
                    options: option,
                    answer: answer,
                    image: image
                });
                if (response) {
                    window.alert('Thêm mới thành công');
                }
            }
        }
        catch (error) {
            window.alert(error);
            console.log('Error: ', error);
        }
    }

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${API_QUESTION}/${id}`);
            if (response) {
                window.alert('Xóa thành công');
                navigate('/admin')
            }
        }
        catch (error) {
            window.alert(error);
            console.log('Error: ', error);
        }
    }

    return (
        <div className="container-fluid px-4 py-4" style={{ minHeight: '100vh' }}>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="shadow-lg border-0 mb-4">
                        <div className="text-center py-4 border-0 bg-info">
                            <h3 className="mb-1">
                                <i className={`fas ${isEdit ? 'fa-edit' : 'fa-plus-circle'} me-3 fa-2x`}></i>
                                {isEdit ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}
                            </h3>
                            <p className="mb-0 opacity-75">
                                {isEdit ? 'Cập nhật thông tin câu hỏi' : 'Tạo câu hỏi mới cho hệ thống'}
                            </p>
                        </div>
                    </div>
                    <div className="shadow-lg border-0 mb-4">
                        <div className="bg-white border-0 py-3 ms-3 ">
                            <h5 className="mb-0">
                                Nội dung câu hỏi
                            </h5>
                        </div>
                        <div className="p-4">
                            <div className="form-group">
                                <label className="form-label fw-semibold mb-3">
                                    Câu hỏi
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Nhập nội dung câu hỏi..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="shadow-lg border-0 mb-4">
                        <div className="bg-white border-0 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 ms-3">
                                    Các đáp án
                                </h5>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-success me-3"
                                    onClick={() => setOption([...option, ""])}
                                >
                                    Thêm đáp án
                                </button>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            {(option || []).map((opt, index) => (
                                <div key={index} className="mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={opt}
                                            onChange={(e) => {
                                                const newOptions = [...option];
                                                newOptions[index] = e.target.value;
                                                setOption(newOptions);
                                            }}
                                            placeholder={`Nhập đáp án`}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() => {
                                                const newOptions = option.filter((op, i) => i !== index);
                                                setOption(newOptions);
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {option.length === 0 && (
                                <div className="text-center py-4">
                                    <i className="fas fa-plus-circle fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">Chưa có đáp án nào. Hãy thêm đáp án đầu tiên.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Correct Answer */}
                    <div className="card shadow-lg border-0 mb-4">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0">
                                Đáp án đúng
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <select
                                className="form-select"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                            >
                                <option value="">Chọn đáp án đúng</option>
                                {(option || []).map((opt, index) => (
                                    <option key={index} value={index + 1}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="card shadow-lg border-0 mb-4">
                        <div className="card-header bg-white border-0 py-3">
                            <h5 className="mb-0">
                                Hình ảnh (Tùy chọn)
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            {image && (
                                <div className="text-center mb-4">
                                    <img
                                        src={image}
                                        alt="Question preview"
                                        className="img-fluid rounded shadow-sm"
                                        style={{
                                            maxHeight: '300px',
                                            borderRadius: '15px',
                                            border: '2px solid #e9ecef'
                                        }}
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label fw-semibold mb-2">
                                    URL hình ảnh
                                </label>
                                <input
                                    type="url"
                                    className="form-control"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                                <small className="text-muted mt-2 d-block">
                                    Nhập URL của hình ảnh để hiển thị cùng câu hỏi
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="shadow-lg border-0">
                        <div className="p-4">
                            <div className="d-flex gap-3 justify-content-center flex-wrap">
                                <button
                                    className="btn px-4 py-3 btn-success"
                                    onClick={handleSave}
                                >
                                    {isEdit ? 'Cập Nhật' : 'Thêm Mới'}
                                </button>

                                {isEdit && (
                                    <button
                                        className="btn px-4 py-3 btn-danger"
                                        onClick={handleDelete}
                                    >
                                        Xóa
                                    </button>
                                )}

                                <button
                                    className="btn btn-secondary px-4 py-3"
                                    onClick={() => navigate('/admin')}
                                >
                                    Quay lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditQ;