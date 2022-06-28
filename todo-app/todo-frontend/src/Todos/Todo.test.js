import { render } from '@testing-library/react'
import { Todo } from './List'
describe('Testing todo element', () => {
  it('Can render', () => {
    const todo = {
      id: 'testid',
      text: 'texttest',
      done: false
    }
    const { getByText } = render(<Todo todo={todo}/>)
    expect(getByText('texttest')).toBeTruthy()
    //expect(false).toBeTruthy()
  }) 
})
