import { RepositoryInterface } from '@shared/repository/repository.interface';
import { User } from '../domains/user.domain';

export interface UserRepositoryInterface extends RepositoryInterface<User> {}
