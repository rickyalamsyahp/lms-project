export default function lessonAPIDocs() {
  console.log('generate Lesson API Docs')
}

/**
 * @swagger
 * paths:
 *  /admin/lesson:
 *    get:
 *      tags:
 *        - Lesson - Admin
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
 *        - Lesson - Admin
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/Lesson'
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/lesson/{id}:
 *    get:
 *      tags:
 *        - Lesson - Admin
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
 *        - Lesson - Admin
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
 *              $ref: '#/components/schemas/LessonEdit'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Lesson - Admin
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
 *  /admin/lesson/{id}/publish:
 *    put:
 *      tags:
 *        - Lesson - Admin
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
 *  /admin/lesson/{id}/download:
 *    get:
 *      tags:
 *        - Lesson - Admin
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
 *  /instructor/lesson:
 *    get:
 *      tags:
 *        - Lesson - Instructor
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
 *  /instructor/lesson/{id}:
 *    get:
 *      tags:
 *        - Lesson - Instructor
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
 *  /instructor/lesson/{id}/download:
 *    get:
 *      tags:
 *        - Lesson - Instructor
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
 *  /public/lesson:
 *    get:
 *      tags:
 *        - Lesson - Public
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
 *  /public/lesson/{id}:
 *    get:
 *      tags:
 *        - Lesson - Public
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
 *  /public/lesson/{id}/download:
 *    get:
 *      tags:
 *        - Lesson - Public
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
 * components:
 *  schemas:
 *    Lesson:
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
 *    LessonEdit:
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
