import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../userContext";
import { useNavigate } from "react-router-dom";

const API_QUES = "http://localhost:3002/questions"

const Admin = () => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState([]);
    const [origin, setOrigin] = useState([]);
    const { user, setUser } = useContext(userContext);
    const [filter, setFilter] = useState('');

    const fetchQuestion = async () => {
        try {
            const response = await axios.get(API_QUES);
            if (response) {
                setOrigin(response.data);
                setQuestion(response.data);
            }
        }
        catch (error) {
            window.alert(`Error: ${error}`)
            console.log("Error: ", error)
        }
    }

    useEffect(() => {
        if (user?.role !== 'admin' || !user) {
            setUser(null);
            navigate('/');
            return;
        }
        fetchQuestion()
    }, [user]);

    useEffect(() => {
        if (filter) {
            const newQuestion = origin.filter((o) =>
                o.question_text.toLowerCase().includes(filter.toLowerCase())
            );
            setQuestion(newQuestion);
        } else {
            setQuestion(origin);
        }
    }, [filter, origin]);

    return (
        <div className="container-fluid px-4 py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="shadow-sm border-0">
                        <div className="p-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                                <div>
                                    <h2 className="mb-1">
                                        Quản lý câu hỏi
                                    </h2>
                                    <p className="text-muted mb-0">Danh sách tất cả câu hỏi trong hệ thống</p>
                                </div>
                                <button
                                    className="btn btn-primary px-4 py-2 w-100 w-md-auto"
                                    onClick={() => navigate('/new')}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Thêm câu hỏi mới
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-12 mx-auto">
                    <div className="shadow-sm border-0">
                        <div className="p-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control border-start-0"
                                    placeholder="Tìm kiếm câu hỏi theo nội dung..."
                                    onChange={(e) => setFilter(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="shadow-sm border-0">
                        <div className="bg-white border-0 pt-4 pb-0">
                            <h5 className="mb-0 ms-3">
                                Danh sách câu hỏi
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            {question.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th className="py-3 px-4 d-none d-md-table-cell">
                                                    ID
                                                </th>
                                                <th className="py-3 px-4">
                                                    Câu Hỏi
                                                </th>
                                                <th className="py-3 px-4 text-center">
                                                    Thao tác
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {question.map((q, index) => (
                                                <tr key={q.id}>
                                                    <td className="py-3 px-4 d-none d-md-table-cell">
                                                        #{q.id}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="d-block d-md-none mb-2">
                                                        </div>
                                                        <div>
                                                            {q.question_text}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => navigate(`/edit/${q.id}`)}
                                                        >
                                                            Chỉnh sửa
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <h5>
                                        {filter ? 'Không tìm thấy câu hỏi nào' : 'Chưa có câu hỏi nào'}
                                    </h5>
                                    <p className="text-muted mb-4">
                                        {filter ? 'Thử tìm kiếm với từ khóa khác' : 'Hãy thêm câu hỏi đầu tiên của bạn'}
                                    </p>
                                    {!filter && (
                                        <button
                                            className="btn px-4 py-2"
                                            onClick={() => navigate('/new')}
                                        >
                                            Thêm câu hỏi đầu tiên
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin;