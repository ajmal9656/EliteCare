import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const secret_key = process.env.JWT_SECRET as string;

const createToken = (id: string,email:string ,role: string): string => {
    return jwt.sign({ id, email,role }, secret_key, { expiresIn: '30m' });
};






const verifyUserToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("hiii",req.cookies);
        
        const accessToken: string = req.cookies.AccessToken;
        console.log("acc",accessToken);
        
        if (accessToken) {
            console.log("access user",accessToken);
            
            jwt.verify(accessToken, secret_key, async (err, decoded) => {
                if (err) {
                    await handleRefreshToken(req, res, next);
                } else {
                    const { role } = decoded as jwt.JwtPayload;
                    if (role !== "user") { 
                        return res.status(401).json({ message: 'Access denied. Insufficient role.' });
                    }
                    next();
                };
            });
        } else {
            console.log("not access");
            
            await handleRefreshToken(req, res, next);
        };
    } catch (error) {
        res.status(401).json({ message: 'Access denied. Access token not valid.' });
    };
};
const verifyDoctorToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken: string = req.cookies.AccessToken;
        if (accessToken) {
            jwt.verify(accessToken, secret_key, async (err, decoded) => {
                if (err) {
                    await handleRefreshToken(req, res, next);
                } else {
                    const { role } = decoded as jwt.JwtPayload;
                    if (role !== "doctor") { 
                        return res.status(401).json({ message: 'Access denied. Insufficient role.' });
                    }
                    next();
                };
            });
        } else {
            await handleRefreshToken(req, res, next);
        };
    } catch (error) {
        res.status(401).json({ message: 'Access denied. Access token not valid.' });
    };
};


const verifyAdminToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminToken: string = req.cookies.AccessToken;
        if (adminToken) {
            jwt.verify(adminToken, secret_key, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Access denied. Admin token expired or invalid.' });
                } else {
                    const { role } = decoded as jwt.JwtPayload;
                    if (role !== "admin") {
                        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
                    }
                    next();
                };
            });
        } else {
            return res.status(401).json({ message: 'Access denied. Admin token not provided.' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Access denied. Admin token not valid.' });
    };
};

const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken: string = req.cookies.RefreshToken;
    if (refreshToken) {
        jwt.verify(refreshToken, secret_key, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Access denied. Refresh token not valid.' });
            } else {
                const { id,email, role } = decoded as jwt.JwtPayload;
                if (!id || !role) {
                    return res.status(401).json({ message: 'Access denied. Token payload invalid.' });
                } else {
                    const newAccessToken = createToken(id,email, role);
                    res.cookie("AccessToken", newAccessToken, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 24 * 60 * 60 * 1000, 
                    });
                    next();
                };
            };
        });
    } else {
        return res.status(401).json({ message: 'Access denied. Refresh token not provided.' });
    };
};

export { createToken, verifyUserToken,verifyDoctorToken, verifyAdminToken};