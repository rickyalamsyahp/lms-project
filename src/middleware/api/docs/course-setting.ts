export default function courseSettingAPIDocs() {
  console.log('generate Course Setting API Docs')
}

/**
 * @swagger
 * paths:
 *  /admin/course-setting:
 *    get:
 *      tags:
 *        - Course Setting - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *          - name: courseId:eq
 *            in: query
 *            description: ID Course
 *            schema:
 *              type: integer
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
 *            description: Pencarian berdasarkan judul exam. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Course Setting - Admin
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseSetting'
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/course-setting/{id}:
 *    get:
 *      tags:
 *        - Course Setting - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - Course Setting - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseSetting'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Course Setting - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/course-setting:
 *    get:
 *      tags:
 *        - Course Setting - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *          - name: courseId:eq
 *            in: query
 *            description: ID Course
 *            schema:
 *              type: integer
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
 *            description: Pencarian berdasarkan judul exam. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Course Setting - Instructor
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseSetting'
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/course-setting/{id}:
 *    get:
 *      tags:
 *        - Course Setting - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - Course Setting - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseSetting'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Course Setting - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /public/course-setting:
 *    get:
 *      tags:
 *        - Course Setting - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *          - name: courseId:eq
 *            in: query
 *            description: ID Course
 *            schema:
 *              type: integer
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
 *  /public/course-setting/{id}:
 *    get:
 *      tags:
 *        - Course Setting - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course-setting/{id}/download:
 *    get:
 *      tags:
 *        - Course Setting - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course-setting/{id}/stats:
 *    get:
 *      tags:
 *        - Course Setting - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    CourseSetting:
 *      type: object
 *      required:
 *        - courseId
 *        - name
 *        - type
 *        - template
 *      properties:
 *        courseId:
 *          type: number
 *          required: true
 *        name:
 *          type: string
 *        type:
 *          type: string
 *          description: Jenis [setting, assessment]
 *        template:
 *          type: string
 *          description: JSON template
 */
