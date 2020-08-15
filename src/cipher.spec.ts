/* eslint-disable no-undef */
import { KeyMaker } from './key-maker'
import { Encryption } from './encryption'
import { Cipher } from './cipher'
import * as uuid from 'uuid'

describe('Cipher', () => {
    let keyMaker: KeyMaker
    let encryption: Encryption

    beforeEach(() => {
        keyMaker = new KeyMaker()
        encryption = new Encryption()
    })

    it('should encrypt a model', async () => {
        const keys = await Promise.all(['1', '2'].map(p => keyMaker.createKey(p)))
        const model = { message: 'hello world', secretMessage: 'privacy matters' }

        const encryptedModel = Cipher.encryptModel(model, keys, { fields: ['secretMessage'] })

        expect(encryptedModel._cipherFields[0]).toBe('secretMessage')

        expect(Object.keys(encryptedModel._cipherKeys)).toHaveLength(2)
    })

    it('should decrypt a model', async () => {
        const cloudPasswords = [uuid.v4(), uuid.v4()]
        const keys = await Promise.all(cloudPasswords.map(p => keyMaker.createKey(p)))
        const model = { message: 'hello world', secretMessage: 'privacy matters' }

        const encryptedModel = Cipher.encryptModel(model, keys, { fields: ['secretMessage'] })
        const decryptedModel = Cipher.decryptModel(encryptedModel, keys[0], cloudPasswords[0])

        expect(decryptedModel.secretMessage).toBe(model.secretMessage)

        expect(decryptedModel._cipherKeys).toBeUndefined()
        expect(decryptedModel._cipherKeys).toBeUndefined()
    })
})