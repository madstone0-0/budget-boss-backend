import { compare, genSalt, hash } from "bcrypt";
import { NewUser, getUser, insertUser } from "../db/schema/users";
import { logger } from "../logging";
import { UserInfo, ServiceReturn } from "../types";
import { ROUNDS } from "../constants";
import { prettyPrint } from "..";

class UserService {
    async Login(
        userInfo: UserInfo,
        generateTokens: (userId: string) => {
            accessToken: string;
            refreshToken: string;
        },
    ): Promise<ServiceReturn> {
        const { email, password } = userInfo;
        try {
            const users = await getUser(email);

            if (users.length == 0) {
                logger.info(`User: ${email} not found`);
                return { status: 404, data: { msg: "User not found" } };
            }

            logger.info(`User: ${email} found`);

            const { passhash, userId } = users[0];
            const compareResult = await compare(password, passhash);
            if (compareResult) {
                const { accessToken, refreshToken } = generateTokens(userId);

                const userDetails = {
                    id: userId,
                    email: email,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
                logger.info(prettyPrint(userDetails));
                return { status: 200, data: { userDetails } };
            } else {
                logger.info(`Incorrect password: ${email}`);
                return { status: 401, data: { msg: "Incorrect Password" } };
            }
        } catch (err: any) {
            logger.info(`/auth/signup Error: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async SignUp(userInfo: UserInfo): Promise<ServiceReturn> {
        const { email, password } = userInfo;
        try {
            const users = await getUser(email);

            if (users.length !== 0) {
                logger.info(`User: ${email} already registered`);
                return {
                    status: 400,
                    data: { msg: "Email is already registered" },
                };
            }

            const salt = await genSalt(ROUNDS);
            const user: NewUser = {
                email: email,
                salt: salt,
                passhash: await hash(password, salt),
            };

            try {
                const result = await insertUser(user);

                logger.info(`User: ${email} successfully registered`);
                logger.info(prettyPrint(result));
                return {
                    status: 200,
                    data: { msg: "User inserted successfully" },
                };
            } catch (err: any) {
                return { status: 500, data: { msg: err.message } };
            }
        } catch (err: any) {
            logger.info(`/auth/signup Error: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }
}

export default UserService;
