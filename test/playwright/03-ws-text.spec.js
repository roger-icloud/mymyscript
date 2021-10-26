const { expect } = require('chai')
const { exported, isEditorInitialized, playStrokes } = require('./helper')

const { helloHow, helloStrike } = require('../lib/inksDatas')

describe(`${process.env.BROWSER}:v4/websocket_text_iink.html`, () => {
  it('should check smartguide', async () => {
    const editorEl = await page.waitForSelector('#editor')
    const isInit = await isEditorInitialized(editorEl)
    expect(isInit).to.equal(true)

    await playStrokes(page, helloHow.strokes, 0, 0)
    await page.evaluate(exported)

    const smartguide = await page.waitForSelector('.smartguide')
    const randomString = await smartguide.evaluate(node => node.id.replace('smartguide', ''))

    const prompterText = await page.waitForSelector('.prompter-text')
    let textContent = await prompterText.evaluate(node => node.textContent)
    const labelsWithNbsp = helloHow.exports.TEXT[helloHow.exports.TEXT.length - 1]
      .replace(/\s/g, '\u00A0')

    expect(labelsWithNbsp).to.equal(textContent)

    await page.click(`#ellipsis${randomString}`)
    await page.click(`#convert${randomString}`)

    await page.evaluate(exported)

    textContent = await prompterText.evaluate(node => node.textContent)
    expect(labelsWithNbsp).to.equal(textContent)

    const words = labelsWithNbsp.toString().split('\u00A0')
    // a random word in the smartGuide
    const wordIdx = Math.floor(Math.random() * words.length)
    await page.click('#word-' + (wordIdx * 2) + randomString)

    await page.waitForSelector(`#candidates${randomString}`)
    const candidates = await page.waitForSelector(`#candidates${randomString}`)
    const nbCand = await candidates.evaluate(node => node.getElementsByTagName('span').length)

    // a random candidate in the smartGuide
    const candIdx = Math.floor(Math.random() * nbCand)
    const candidateEl = await page.waitForSelector(`#cdt-${candIdx}${randomString}`)
    const candidateTextContent = await candidateEl.evaluate(node => node.textContent)

    await page.click(`#cdt-${candIdx}${randomString}`)
    await page.evaluate(exported)

    textContent = await prompterText.evaluate(node => node.textContent)
    expect(textContent.indexOf(candidateTextContent)).to.greaterThan(-1)
  })

  it('should check gesture works', async () => {
    const editorEl = await page.waitForSelector('#editor')
    const isInit = await isEditorInitialized(editorEl)
    expect(isInit).to.equal(true)

    await editorEl.evaluate(node => {
      node.editor.close()
        .then(() => {
          console.log('editor close')
        })
        .catch((e) => console.error(e))
    })

    await playStrokes(page, helloStrike.strokes, 0, 0)
    await page.evaluate(exported)

    let result = await editorEl.evaluate(node => node.editor.model.exports['text/plain'])
    expect(result).to.equal('')

    await editorEl.evaluate(node => {
      node.editor.close()
        .then(() => {
          console.log('editor close')
        })
        .catch((e) => console.error(e))
      node.editor.configuration.recognitionParams.iink.gesture = { enable: false }
    })

    const exportedEvent = page.evaluate(exported)
    await playStrokes(page, helloStrike.strokes, 0, 0)
    await exportedEvent

    result = await editorEl.evaluate(node => node.editor.model.exports['text/plain'])
    expect(result).not.equal('')
  })
})