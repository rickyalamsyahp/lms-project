export default function submissoinAPIDocs() {
  console.log('generate Submission API Docs')
}

/**
 * @swagger
 * paths:
 *  /instructor/submission:
 *    get:
 *      tags:
 *        - Submission Instructor
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
 *        - name: module.name:likelower
 *          in: query
 *          description: Pencarian berdasarkan nama modul
 *          required: false
 *          schema:
 *            type: string
 *            example: %mengemudi%
 *      responses:
 *        default:
 *          description: sukses
 *    post:
 *      tags:
 *        - Submission Instructor
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
 *        - Submission Instructor
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
 *    put:
 *      tags:
 *        - Submission Instructor
 *      security:
 *        - accessToken: []
 *        - apiKey: []
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
 *              $ref: '#/components/schemas/Submission'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Submission Instructor
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
 *        - Submission Instructor
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
 *        - Submission Instructor
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
 *        moduleId:
 *          type: number
 *          required: true
 *          description: ID dari modul yang disimulasikan
 *        setting:
 *          type: object
 *          description: JSON setting simulators
 *    SubmissionFinish:
 *      type: object
 *      properties:
 *        score:
 *          type: number
 *          required: true
 */
