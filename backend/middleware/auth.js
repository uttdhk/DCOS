const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
        // 세션 유효시간 연장 (30분)
        req.session.touch();
        next();
    } else {
        res.status(401).json({ 
            success: false, 
            message: '로그인이 필요합니다. 세션이 만료되었습니다.' 
        });
    }
};

module.exports = {
    checkSession
};