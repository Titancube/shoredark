import { On } from '@typeit/discord'

export abstract class Role {
  @On('messageReactionAdd')
  private roleAdd() {
    // assign a role to the user
  }

  @On('messageReactionRemove')
  private roleRemove() {
    // remove a role from the user
  }
}
