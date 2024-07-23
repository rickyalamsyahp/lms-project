export default function courseExamAPIDocs() {
  console.log('generate Course Exam API Docs')
}

/**
 * @swagger
 * paths:
 *  /admin/course-exam:
 *    get:
 *      tags:
 *        - Course Exam - Admin
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
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CourseExam'
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/course-exam/{id}:
 *    get:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CourseExam'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /admin/course-exam/{id}/setting:
 *    get:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: ID Course Exam
 *        - name: type:eq
 *          in: query
 *          description: Jenis template setting [setting, assessment]
 *          required: true
 *          example: setting
 *        - name: page
 *          in: query
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
 *          description: Pencarian berdasarkan judul exam. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *          required: false
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseExamSetting'
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/course-exam/{id}/setting/{settingId}:
 *    get:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *        - name: settingId
 *          in: path
 *          description: ID course exam setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *        - name: settingId
 *          in: path
 *          description: ID course exam setting
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseExamSetting'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Course Exam - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *        - name: settingId
 *          in: path
 *          description: ID course exam setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/course-exam:
 *    get:
 *      tags:
 *        - Course Exam - Instructor
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
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CourseExam'
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/course-exam/{id}:
 *    get:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/CourseExam'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/course-exam/{id}/setting:
 *    get:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          description: ID Course Exam
 *        - name: type:eq
 *          in: query
 *          description: Jenis template setting [setting, assessment]
 *          required: true
 *          example: setting
 *        - name: page
 *          in: query
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
 *          description: Pencarian berdasarkan judul exam. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *          required: false
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseExamSetting'
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/course-exam/{id}/setting/{settingId}:
 *    get:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *        - name: settingId
 *          in: path
 *          description: ID course exam setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    put:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *        - name: settingId
 *          in: path
 *          description: ID course exam setting
 *          required: true
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CourseExamSetting'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Course Exam - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *        - name: settingId
 *          in: path
 *          description: ID course exam setting
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /public/course-exam:
 *    get:
 *      tags:
 *        - Course Exam - Public
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
 *  /public/course-exam/{id}:
 *    get:
 *      tags:
 *        - Course Exam - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course-exam/{id}/download:
 *    get:
 *      tags:
 *        - Course Exam - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course-exam/{id}/stats:
 *    get:
 *      tags:
 *        - Course Exam - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *  /public/course-exam/{id}/stats/{userId}:
 *    get:
 *      tags:
 *        - Course Exam - Public
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID course exam
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
 *    CourseExam:
 *      type: object
 *      required:
 *        - title
 *        - courseId
 *      properties:
 *        file:
 *          type: string
 *          format: binary
 *        courseId:
 *          type: number
 *        title:
 *          type: string
 *          example: Pengenalan
 *        description:
 *          type: string
 *        level:
 *          type: number
 *    CourseExamSetting:
 *      type: object
 *      required:
 *        - courseExamId
 *        - name
 *        - type
 *        - template
 *      properties:
 *        name:
 *          type: string
 *        type:
 *          type: string
 *          description: Jenis [setting, assessment]
 *        template:
 *          type: string
 *          description: JSON template
 */
