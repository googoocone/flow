
export async function transcribeWithClova(fileBlob: Blob, filename: string): Promise<string> {
    const invokeUrl = process.env.CLOVA_SPEECH_INVOKE_URL
    const secretKey = process.env.CLOVA_SPEECH_SECRET

    if (!invokeUrl || !secretKey) {
        throw new Error('Clova Speech API credentials are missing (CLOVA_SPEECH_INVOKE_URL, CLOVA_SPEECH_SECRET)')
    }

    const params = {
        language: 'ko-KR',
        completion: 'sync',
        wordAlignment: false,
        fullText: true,
    }

    const formData = new FormData()
    formData.append('media', fileBlob, filename)
    formData.append('params', JSON.stringify(params))

    try {
        console.log(`Sending file ${filename} to Clova Speech API...`)
        const response = await fetch(`${invokeUrl}/recognizer/upload`, {
            method: 'POST',
            headers: {
                'X-CLOVASPEECH-API-KEY': secretKey,
            },
            body: formData,
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Clova API Error Response:', errorText)
            throw new Error(`Clova API Request Failed: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        if (data.text) {
            console.log('Clova Transcription Success:', data.text.substring(0, 50) + '...')
            return data.text
        } else {
            console.warn('Clova response missing text:', data)
            return ''
        }
    } catch (error) {
        console.error('Clova Transcription Error:', error)
        throw error
    }
}
