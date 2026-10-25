import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import ImageDisplay from './ImageDisplay'

afterEach(cleanup)

describe('ImageDisplay', () => {
  it('渡された画像を表示する', () => {
    render(<ImageDisplay imageData="blob:test-image" scale={1} />)

    expect(screen.getByRole('heading', { name: 'Extracted Image' })).toBeTruthy()
    expect(screen.getByRole('img').getAttribute('src')).toBe('blob:test-image')
  })

  it('縮小率に応じて表示サイズを変える', () => {
    render(<ImageDisplay imageData="blob:test-image" scale={0.5} />)

    const img = screen.getByRole('img')
    expect(img.style.width).toBe('50%')
    expect(img.style.height).toBe('50%')
  })
})
