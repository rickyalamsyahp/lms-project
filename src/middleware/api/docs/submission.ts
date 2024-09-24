export default function submissoinAPIDocs() {
  console.log('generate Submission API Docs')
}

/**
 * @swagger
 * paths:
 *  /admin/submission:
 *    get:
 *      tags:
 *        - Submission - Admin
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
 *        - name: objectType:eq
 *          in: query
 *          description: Pencarian berdasarkan jenis objek
 *          required: false
 *        - name: course.name:likelower
 *          in: query
 *          description: Pencarian berdasarkan nama course
 *          required: false
 *          schema:
 *            type: string
 *            description: untuk pencarian menggunakan format %[KEYWORD]%
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/submission/{id}:
 *    get:
 *      tags:
 *        - Submission - Admin
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /admin/submission/{submissionId}/report:
 *    get:
 *      tags:
 *        - Submission Report - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
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
 *        - name: objectType:eq
 *          in: query
 *          description: Pencarian berdasarkan jenis objek
 *          required: false
 *        - name: tag.name:likelower
 *          in: query
 *          description: Pencarian berdasarkan tag
 *          required: false
 *          schema:
 *            type: string
 *            description: untuk pencarian menggunakan format %[KEYWORD]%
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/submission/{submissionId}/report/{reportId}:
 *    get:
 *      description: download report file
 *      tags:
 *        - Submission Report - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *        - name: reportId
 *          in: path
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /admin/submission/{submissionId}/log:
 *    get:
 *      tags:
 *        - Submission Log - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
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
 *        - name: objectType:eq
 *          in: query
 *          description: Pencarian berdasarkan jenis objek
 *          required: false
 *        - name: tag.name:likelower
 *          in: query
 *          description: Pencarian berdasarkan tag
 *          required: false
 *          schema:
 *            type: string
 *            description: untuk pencarian menggunakan format %[KEYWORD]%
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/submission/{submissionId}/log/{logId}:
 *    get:
 *      description: download log file
 *      tags:
 *        - Submission Log - Admin
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *        - name: logId
 *          in: path
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/submission:
 *    get:
 *      tags:
 *        - Submission - Instructor
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
 *        - name: objectType:eq
 *          in: query
 *          description: Pencarian berdasarkan jenis objek
 *          required: false
 *        - name: course.name:likelower
 *          in: query
 *          description: Pencarian berdasarkan nama course
 *          required: false
 *          schema:
 *            type: string
 *            description: untuk pencarian menggunakan format %[KEYWORD]%
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Submission - Instructor
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Submission'
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/submission/{id}:
 *    get:
 *      tags:
 *        - Submission - Instructor
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Submission - Instructor
 *      security:
 *        - accessToken: []
 *        - apiKey: []
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/submission/{id}/cancel:
 *    put:
 *      tags:
 *        - Submission - Instructor
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
 *  /instructor/submission/{id}/finish:
 *    put:
 *      tags:
 *        - Submission - Instructor
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
 *              $ref: '#/components/schemas/SubmissionFinish'
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/submission/{submissionId}/log:
 *    get:
 *      tags:
 *        - Submission Log - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
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
 *        - name: objectType:eq
 *          in: query
 *          description: Pencarian berdasarkan jenis objek
 *          required: false
 *        - name: tag.name:likelower
 *          in: query
 *          description: Pencarian berdasarkan tag
 *          required: false
 *          schema:
 *            type: string
 *            description: untuk pencarian menggunakan format %[KEYWORD]%
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Submission Log - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/SubmissionLog'
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/SubmissionLogExternal'
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/submission/{submissionId}/log/{logId}:
 *    get:
 *      description: download log file
 *      tags:
 *        - Submission Log - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *        - name: logId
 *          in: path
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      description: remove log file
 *      tags:
 *        - Submission Log - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *        - name: logId
 *          in: path
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 */

/**
 * @swagger
 * paths:
 *  /instructor/submission/{submissionId}/report:
 *    get:
 *      tags:
 *        - Submission Report - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
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
 *        - name: objectType:eq
 *          in: query
 *          description: Pencarian berdasarkan jenis objek
 *          required: false
 *        - name: tag.name:likelower
 *          in: query
 *          description: Pencarian berdasarkan tag
 *          required: false
 *          schema:
 *            type: string
 *            description: untuk pencarian menggunakan format %[KEYWORD]%
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Submission Report - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/SubmissionReport'
 *      responses:
 *        default:
 *          description: sukses
 *  /instructor/submission/{submissionId}/report/{reportId}:
 *    get:
 *      description: download report file
 *      tags:
 *        - Submission Report - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *        - name: reportId
 *          in: path
 *          required: true
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      description: remove report file
 *      tags:
 *        - Submission Report - Instructor
 *      security:
 *        - accessToken: []
 *      parameters:
 *        - name: submissionId
 *          in: path
 *          required: true
 *        - name: logId
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
 *    Submission:
 *      type: object
 *      properties:
 *        owner:
 *          type: string
 *          required: true
 *          description: ID user-account student
 *        objectType:
 *          type: string
 *          required: true
 *          description: Jenis Objek, contoh untuk kereta adalah KRL atau MRT
 *        courseId:
 *          type: number
 *          required: true
 *          description: ID dari course yang disimulasikan
 *        courseExamId:
 *          type: number
 *          required: true
 *          description: ID course exam yang dipilih
 *        setting:
 *          type: object
 *          description: JSON setting simulators
 *    SubmissionFinish:
 *      type: object
 *      properties:
 *        score:
 *          type: number
 *          required: true
 *        assessment:
 *          type: object
 *          description: JSON form penilaian yang telah diisi
 *    SubmissionLog:
 *      type: object
 *      required:
 *        - file
 *        - tag
 *      properties:
 *        file:
 *          type: string
 *          format: binary
 *        tag:
 *          type: string
 *    SubmissionLogExternal:
 *      type: object
 *      required:
 *        - tag
 *      properties:
 *        tag:
 *          type: string
 *          example: video or simulation
 *        filename:
 *          type: string
 *          example: test.mp4
 *        encoding:
 *          type: string
 *          example: 7bit
 *        size:
 *          type: number
 *        mimetype:
 *          type: string
 *          example: video/mp4
 *    SubmissionReport:
 *      type: object
 *      required:
 *        - file
 *        - tag
 *      properties:
 *        file:
 *          type: string
 *          format: binary
 *        tag:
 *          type: string
 */
