import { SUPPORTED_LANGUAGES, USER_ROLES } from "@stability/config";
import { z } from "zod";

export const supportedLanguageSchema = z.enum(SUPPORTED_LANGUAGES);
export const userRoleSchema = z.enum(USER_ROLES);
