export default function moduleAPIDocs() {
  console.log('generate Module API Docs')
}

/**
 * @swagger
 * paths:
 *  /admin/module:
 *    get:
 *      tags:
 *        - Module Management
 *      security:
 *        - accessToken: []
 *      parameters:
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
 *          - name: name:likeLower
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
 *        - Module Management
 *      security:
 *        - accessToken: []
 *      requestBody:
 *        content:
 *          multipart/form-data:
 *            schema:
 *              $ref: '#/components/schemas/Module'
 *      responses:
 *        default:
 *          description: sukses
 *  /admin/module/{id}:
 *    get:
 *      tags:
 *        - Module Management
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
 *        - Module Management
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
 *              $ref: '#/components/schemas/ModuleEdit'
 *      responses:
 *        default:
 *          description: sukses
 *    delete:
 *      tags:
 *        - Module Management
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
 *  /admin/module/{id}/publish:
 *    put:
 *      tags:
 *        - Module Management
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
 *  /public/module:
 *    get:
 *      tags:
 *        - Module Public
 *      security:
 *        - accessToken: []
 *      parameters:
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
 *          - name: name:likeLower
 *            in: query
 *            description: Pencarian berdasarkan nama user. Dokumentasi filter bisa dilihat disini https://github.com/Vincit/objection-find
 *            required: false
 *            schema:
 *              type: string
 *      responses:
 *        default:
 *          description: sukses
 *  /public/module/{id}:
 *    get:
 *      tags:
 *        - Module Public
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
 *  /public/module/{id}/download:
 *    get:
 *      tags:
 *        - Module Public
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
 *    Module:
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
 *    ModuleEdit:
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
 */
