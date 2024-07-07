export default function authAPIDocs() {
  console.log('generate Auth API Docs')
}

/**
 * @swagger
 * paths:
 *  /auth/authorize:
 *    post:
 *      tags:
 *        - Auth
 *      requestBody:
 *        content:
 *          application/json:
 *             schema:
 *              $ref: '#/components/schemas/Login'
 *      responses:
 *        default:
 *          description: successfull operation
 *  /auth/register:
 *    post:
 *      tags:
 *        - Auth
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - email
 *                - name
 *                - username
 *                - password
 *              properties:
 *                email:
 *                  type: string
 *                  example: test@mail.com
 *                name:
 *                  type: string
 *                  example: Asep Sumarsep
 *                username:
 *                  type: string
 *                  example: sep_asep
 *                password:
 *                  type: string
 *                  example: password123
 *      responses:
 *        default:
 *          description: successfull operation
 *  /auth/otp/reset-password:
 *    description: Kirim OTP untuk mereset password
 *    post:
 *      tags:
 *        - Auth
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: user@mail.com
 *      responses:
 *        default:
 *          description: sukses
 *  /auth/reset-password:
 *    post:
 *      tags:
 *        - Auth
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: user@mail.com
 *                otp:
 *                  type: string
 *                  example: 123456
 *                  description: OTP dikirim melalui email
 *                newPassword:
 *                  type: string
 *                  example: password123
 *      responses:
 *        default:
 *          description: sukses
 * components:
 *  schemas:
 *    Login:
 *      type: object
 *      required:
 *        - username
 *        - password
 *      properties:
 *        username:
 *          type: string
 *          example: admin
 *        password:
 *          type: string
 *          example: Admin!23@#
 *  securitySchemes:
 *   accessToken:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: jwt
 */
