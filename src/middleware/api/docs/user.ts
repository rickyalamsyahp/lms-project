export default function userAPIDocs() {
  console.log('generate User API Docs')
}

/**
 * @swagger
 * paths:
 *  /my-profile:
 *    get:
 *      tags:
 *        - My Profile
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      responses:
 *        default::
 *          description: sukses
 *    put:
 *      tags:
 *        - My Profile
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserProfile'
 *      responses:
 *        default:
 *          description: sukses
 *  /my-profile/change-password:
 *    put:
 *      tags:
 *        - My Profile
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - newPassword
 *                - oldPassword
 *              properties:
 *                newPassword:
 *                  type: string
 *                  example: newpassword
 *                oldPassword:
 *                  type: string
 *                  example: oldpassword
 *      responses:
 *        default:
 *          description: sukses
 *  /my-profile/avatar:
 *    put:
 *      tags:
 *        - My Profile
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *      responses:
 *        default:
 *          description: sukses
 *    get:
 *      tags:
 *        - My Profile
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /admin/user-account/scope/{scope}:
 *    get:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: scope
 *          in: path
 *          description: Scope akun user yang terdiri dari admin, instructor, dan trainee
 *          required: true
 *          schema:
 *            type: string
 *            example: trainee
 *        - name: page
 *          in: query
 *          description: Halaman
 *          required: false
 *          schema:
 *            type: integer
 *            example: 1
 *        - name: size
 *          in: query
 *          description: Jumlah baris data dalam setiap halaman
 *          required: false
 *          schema:
 *            type: integer
 *            example: 20
 *        - name: order
 *          in: query
 *          description: Urutan data pada tabel dengan pilihan asc atau desc
 *          required: false
 *          schema:
 *            type: string
 *            example: desc
 *        - name: orderBy
 *          in: query
 *          description: Kolom yang menjadi referensi pengurutan data
 *          required: false
 *          schema:
 *            type: string
 *            example: createdAt
 *        - name: name:likeLower
 *          in: query
 *          description: Pencarian berdasarkan nama user. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *          required: false
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account:
 *    post:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  required: true
 *                  example: user_abc
 *                name:
 *                  type: string
 *                  example: Arif Ramdhani
 *                password:
 *                  type: string
 *                  example: password123
 *                scope:
 *                  type: string
 *                  description: Scope akun user dengan pilihan admin atau user
 *                  example: user
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}:
 *    get:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserProfile'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}/activate:
 *    put:
 *      description: Merubah status aktif user
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}/change-password:
 *    put:
 *      description: Mengganti password user
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newPassword:
 *                  type: string
 *                  required: true
 *                  example: password123
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}/avatar:
 *    put:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /admin/user-account/scope/{scope}:
 *    get:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: scope
 *          in: path
 *          description: Scope akun user yang terdiri dari admin, instructor, dan trainee
 *          required: true
 *          schema:
 *            type: string
 *            example: trainee
 *        - name: page
 *          in: query
 *          description: Halaman
 *          required: false
 *          schema:
 *            type: integer
 *            example: 1
 *        - name: size
 *          in: query
 *          description: Jumlah baris data dalam setiap halaman
 *          required: false
 *          schema:
 *            type: integer
 *            example: 20
 *        - name: order
 *          in: query
 *          description: Urutan data pada tabel dengan pilihan asc atau desc
 *          required: false
 *          schema:
 *            type: string
 *            example: desc
 *        - name: orderBy
 *          in: query
 *          description: Kolom yang menjadi referensi pengurutan data
 *          required: false
 *          schema:
 *            type: string
 *            example: createdAt
 *        - name: name:likeLower
 *          in: query
 *          description: Pencarian berdasarkan nama user. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *          required: false
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account:
 *    post:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  required: true
 *                  example: user_abc
 *                name:
 *                  type: string
 *                  example: Arif Ramdhani
 *                password:
 *                  type: string
 *                  example: password123
 *                scope:
 *                  type: string
 *                  description: Scope akun user dengan pilihan admin atau user
 *                  example: user
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}:
 *    get:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserProfile'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}/activate:
 *    put:
 *      description: Merubah status aktif user
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}/change-password:
 *    put:
 *      description: Mengganti password user
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                newPassword:
 *                  type: string
 *                  required: true
 *                  example: password123
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/user-account/{id}/avatar:
 *    put:
 *      tags:
 *        - User Account - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/user-account:
 *    get:
 *      tags:
 *        - User Account - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: page
 *          in: query
 *          description: Halaman
 *          required: false
 *          schema:
 *            type: integer
 *            example: 1
 *        - name: size
 *          in: query
 *          description: Jumlah baris data dalam setiap halaman
 *          required: false
 *          schema:
 *            type: integer
 *            example: 20
 *        - name: order
 *          in: query
 *          description: Urutan data pada tabel dengan pilihan asc atau desc
 *          required: false
 *          schema:
 *            type: string
 *            example: desc
 *        - name: orderBy
 *          in: query
 *          description: Kolom yang menjadi referensi pengurutan data
 *          required: false
 *          schema:
 *            type: string
 *            example: createdAt
 *        - name: name:likeLower
 *          in: query
 *          description: Pencarian berdasarkan nama user. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *          required: false
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - User Account - Instructor
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  required: true
 *                  example: user_abc
 *                name:
 *                  type: string
 *                  example: Arif Ramdhani
 *                password:
 *                  type: string
 *                  example: password123
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/user-account/{id}:
 *    get:
 *      tags:
 *        - User Account - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - User Account - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: integer
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserProfile'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - User Account - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/user-account/{id}/avatar:
 *    put:
 *      tags:
 *        - User Account - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                file:
 *                  type: string
 *                  format: binary
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /open/user-account/{id}/avatar:
 *    get:
 *      tags:
 *        - User Open
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *          type: string
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    UserProfile:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          example: Edwin Pentol
 *          required: false
 *        email:
 *          type: string
 *          example: edwin@mail.com
 *          required: false
 *        bio:
 *          type: object
 *          properties:
 *            gender:
 *              type: string
 *              example: male or female
 *              required: false
 *            phoneNumber:
 *              type: string
 *              example: 081214322899
 *              required: false
 *            identityNumber:
 *              type: string
 *              example: 0928781728382918
 *              required: false
 *            born:
 *              type: string
 *              example: 2000-10-01
 *              required: false
 */
