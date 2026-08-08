"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireRoles = exports.RequirePermissions = exports.ROLES_KEY = exports.PERMISSIONS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSIONS_KEY = 'requiredPermissions';
exports.ROLES_KEY = 'requiredRoles';
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;
const RequireRoles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.RequireRoles = RequireRoles;
//# sourceMappingURL=rbac.decorators.js.map