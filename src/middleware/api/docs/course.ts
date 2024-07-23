export default function courseAPIDocs() {
  console.log('generate Course API Docs')
}

/**
 * @swagger
 * paths:
 *  /admin/course:
 *    get:
 *      tags:
 *        - Course - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *              example: 1
 *          - name: size
 *            in: query
 *            description: Jumlah baris data dalam setiap halaman
 *            required: false
 *            schema:
 *              type: integer
 *              example: 20
 *          - name: order
 *            in: query
 *            description: Urutan data pada tabel dengan pilihan asc atau desc
 *            required: false
 *            schema:
 *              type: string
 *              example: desc
 *          - name: orderBy
 *            in: query
 *            description: Kolom yang menjadi referensi pengurutan data
 *            required: false
 *            schema:
 *              type: string
 *              example: createdAt
 *          - name: title:likeLower
 *            in: query
 *            description: Pencarian berdasarkan nama user. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Course - Admin
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/Course'
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/course/{id}:
 *    get:
 *      tags:
 *        - Course - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - Course - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CourseEdit'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Course - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/course/{id}/publish:
 *    put:
 *      tags:
 *        - Course - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/course:
 *    get:
 *      tags:
 *        - Course - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *              example: 1
 *          - name: size
 *            in: query
 *            description: Jumlah baris data dalam setiap halaman
 *            required: false
 *            schema:
 *              type: integer
 *              example: 20
 *          - name: order
 *            in: query
 *            description: Urutan data pada tabel dengan pilihan asc atau desc
 *            required: false
 *            schema:
 *              type: string
 *              example: desc
 *          - name: orderBy
 *            in: query
 *            description: Kolom yang menjadi referensi pengurutan data
 *            required: false
 *            schema:
 *              type: string
 *              example: createdAt
 *          - name: title:likeLower
 *            in: query
 *            description: Pencarian berdasarkan nama user. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/course/{id}:
 *    get:
 *      tags:
 *        - Course - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/course/{id}/download:
 *    get:
 *      tags:
 *        - Course - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /public/course:
 *    get:
 *      tags:
 *        - Course - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *          - name: page
 *            in: query
 *            required: false
 *            schema:
 *              type: integer
 *              example: 1
 *          - name: size
 *            in: query
 *            description: Jumlah baris data dalam setiap halaman
 *            required: false
 *            schema:
 *              type: integer
 *              example: 20
 *          - name: order
 *            in: query
 *            description: Urutan data pada tabel dengan pilihan asc atau desc
 *            required: false
 *            schema:
 *              type: string
 *              example: desc
 *          - name: orderBy
 *            in: query
 *            description: Kolom yang menjadi referensi pengurutan data
 *            required: false
 *            schema:
 *              type: string
 *              example: createdAt
 *          - name: title:likeLower
 *            in: query
 *            description: Pencarian berdasarkan nama user. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course/{id}:
 *    get:
 *      tags:
 *        - Course - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course/{id}/download:
 *    get:
 *      tags:
 *        - Course - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course/{id}/stats:
 *    get:
 *      tags:
 *        - Course - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID module
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course/{id}/stats/{userId}:
 *    get:
 *      tags:
 *        - Course - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course
 *          required: true
 *        - name: userId
 *          description: ID user
 *          in: path
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Course:
 *      type: object
 *      required:
 *        - title
 *        - file
 *      properties:
 *        file:
 *          type: string
 *          format: binary
 *        title:
 *          type: string
 *          example: Pengenalan
 *        description:
 *          type: string
 *        level:
 *          type: number
 *          description: digunakan untuk menentukan urutan
 *    CourseEdit:
 *      type: object
 *      required:
 *        - title
 *      properties:
 *        file:
 *          type: string
 *          format: binary
 *        title:
 *          type: string
 *          example: Pengenalan
 *        description:
 *          type: string
 *        level:
 *          type: number
 *          description: digunakan untuk menentukan urutan
 */
