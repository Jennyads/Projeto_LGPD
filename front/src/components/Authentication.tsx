import React, { useState } from 'react';
import clsx from "clsx";

const Authentication: React.FC<{ onLogin: (key: string) => void }> = ({ onLogin }) => {
    const [secretKey, setSecretKey] = useState('');

    const handleLogin = () => {
        if (secretKey === 'mysecretkey') {
            onLogin(secretKey);
        } else {
            alert('Chave secreta incorreta. Tente novamente.');
        }
    };

    return (
        <>
            <form
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                noValidate
                id="form-solicitacao"
                style={{ margin: "8px" }}
            >
                <div className="text-center mb-4">
                    <h1 className="text-dark fw-bolder mb-3 font-padrao-titulo">
                        SENHA DE ACESSO
                    </h1>
                    <div className="text-gray-500 fs-6 font-padrao-titulo mb-5" style={{ letterSpacing: 0 }}>
                        É necessário uma senha para acessar a listagem.
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-4">
                        <label className="form-label fw-bolder text-dark fs-6">Senha</label>
                        <input
                            placeholder="Senha"
                            type="password"
                            autoComplete="off"
                            className={clsx("form-control bg-transparent")}
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                        />
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                    <button type="button" className="btn btn-form" onClick={handleLogin}>
                        Acessar
                    </button>
                </div>
            </form>
        </>
    );
};

export default Authentication;
