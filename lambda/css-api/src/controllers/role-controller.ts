import { validate } from '../schemas/role';
import { parseErrors } from '../util';
import { injectable } from 'tsyringe';
import { Role, RoleService } from '../services/role-service';
import createHttpError from 'http-errors';

@injectable()
export class RoleController {
  constructor(private roleService: RoleService) {}

  public async get(teamId: number, integrationId: number, environment: string, roleName: string) {
    return await this.roleService.getByName(teamId, integrationId, environment, roleName);
  }

  public async list(teamId: number, integrationId: number, environment: string) {
    return await this.roleService.getAllByEnvironment(teamId, integrationId, environment);
  }

  public async create(teamId: number, integrationId: number, role: Role, environment: string) {
    return await this.roleService.createRole(teamId, integrationId, role, environment);
  }

  public async delete(teamId: number, integrationId: number, roleName: string, environment: string) {
    return await this.roleService.deleteRole(teamId, integrationId, roleName, environment);
  }

  public async update(teamId: number, integrationId: number, roleName: string, environment: string, role: Role) {
    return await this.roleService.updateRole(teamId, integrationId, roleName, environment, role);
  }

  public async createComposite(
    teamId: number,
    integrationId: number,
    roleName: string,
    environment: string,
    compositeRoles: any,
  ) {
    return await this.roleService.createCompositeRole(teamId, integrationId, roleName, environment, compositeRoles);
  }

  public async getComposites(teamId: number, integrationId: number, roleName: string, environment: string) {
    return await this.roleService.getCompositeRoles(teamId, integrationId, roleName, environment);
  }

  public async getComposite(
    teamId: number,
    integrationId: number,
    roleName: string,
    environment: string,
    compositeRoleName: string,
  ) {
    return await this.roleService.getCompositeRole(teamId, integrationId, roleName, environment, compositeRoleName);
  }

  public async deleteComposite(
    teamId: number,
    integrationId: number,
    roleName: string,
    environment: string,
    compositeRoleName: string,
  ) {
    return await this.roleService.deleteCompositeRole(teamId, integrationId, roleName, environment, compositeRoleName);
  }
}
