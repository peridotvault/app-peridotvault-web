/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/registry.json`.
 */
export type Registry = {
  "address": "3bUSqLjWxUgmruzuRwhtWwhV93b4RXVN7bE5qHxHHxLj",
  "metadata": {
    "name": "registry",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "governance",
          "type": "pubkey"
        },
        {
          "name": "treasury",
          "type": "pubkey"
        },
        {
          "name": "factory",
          "type": "pubkey"
        },
        {
          "name": "registrationFee",
          "type": "u64"
        },
        {
          "name": "registrationFeeToken",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "registerGame",
      "discriminator": [
        122,
        44,
        95,
        58,
        89,
        33,
        40,
        59
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "pgcGameState"
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "publisherFeeTokenAccount",
          "optional": true
        },
        {
          "name": "treasuryFeeTokenAccount",
          "optional": true
        },
        {
          "name": "feePaymentMint",
          "optional": true
        },
        {
          "name": "tokenProgram",
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "contractAddress",
          "type": "pubkey"
        },
        {
          "name": "paymentMethod",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "registerGameByFactory",
      "discriminator": [
        97,
        126,
        237,
        176,
        80,
        144,
        17,
        48
      ],
      "accounts": [
        {
          "name": "factory",
          "signer": true
        },
        {
          "name": "feePayer",
          "writable": true,
          "signer": true
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "pgcGameState"
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "feePayerTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "treasuryFeeTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "feePaymentMint",
          "optional": true
        },
        {
          "name": "tokenProgram",
          "optional": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "contractAddress",
          "type": "pubkey"
        },
        {
          "name": "publisher",
          "type": "pubkey"
        },
        {
          "name": "paymentMethod",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setAdmin",
      "discriminator": [
        251,
        163,
        0,
        52,
        91,
        194,
        187,
        92
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "registryState"
          ]
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "account",
          "type": "pubkey"
        },
        {
          "name": "isAdmin",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setFactory",
      "discriminator": [
        46,
        80,
        105,
        138,
        222,
        108,
        79,
        228
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "registryState"
          ]
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "factory",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setFeeExemption",
      "discriminator": [
        49,
        221,
        99,
        185,
        22,
        228,
        186,
        160
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "registryState"
          ]
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "account",
          "type": "pubkey"
        },
        {
          "name": "isExempt",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setGovernance",
      "discriminator": [
        34,
        71,
        128,
        245,
        179,
        42,
        140,
        137
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "registryState"
          ]
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "governance",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setRegistrationFee",
      "discriminator": [
        156,
        222,
        72,
        107,
        152,
        183,
        168,
        199
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "registryState"
          ]
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "registrationFeeMint",
          "optional": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "token",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setStatus",
      "discriminator": [
        181,
        184,
        224,
        203,
        193,
        29,
        177,
        224
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "status",
          "type": "u8"
        }
      ]
    },
    {
      "name": "setTreasury",
      "discriminator": [
        57,
        97,
        196,
        95,
        195,
        206,
        106,
        136
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "registryState"
          ]
        },
        {
          "name": "registryState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "treasury",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "gameState",
      "discriminator": [
        144,
        94,
        208,
        172,
        248,
        99,
        134,
        120
      ]
    },
    {
      "name": "registryState",
      "discriminator": [
        29,
        34,
        224,
        195,
        175,
        183,
        99,
        97
      ]
    }
  ],
  "events": [
    {
      "name": "adminUpdated",
      "discriminator": [
        69,
        82,
        49,
        171,
        43,
        3,
        80,
        161
      ]
    },
    {
      "name": "factoryUpdated",
      "discriminator": [
        70,
        199,
        169,
        219,
        149,
        71,
        121,
        167
      ]
    },
    {
      "name": "feeExemptionUpdated",
      "discriminator": [
        90,
        107,
        54,
        194,
        86,
        15,
        0,
        217
      ]
    },
    {
      "name": "gameRegistered",
      "discriminator": [
        2,
        83,
        36,
        122,
        249,
        190,
        106,
        31
      ]
    },
    {
      "name": "gameStatusUpdated",
      "discriminator": [
        247,
        12,
        74,
        230,
        132,
        141,
        74,
        217
      ]
    },
    {
      "name": "governanceUpdated",
      "discriminator": [
        242,
        176,
        180,
        4,
        237,
        220,
        12,
        2
      ]
    },
    {
      "name": "registrationFeeUpdated",
      "discriminator": [
        166,
        161,
        107,
        244,
        151,
        1,
        35,
        38
      ]
    },
    {
      "name": "registryInitialized",
      "discriminator": [
        144,
        138,
        62,
        105,
        58,
        38,
        100,
        177
      ]
    },
    {
      "name": "treasuryUpdated",
      "discriminator": [
        80,
        239,
        54,
        168,
        43,
        38,
        85,
        145
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "emptyGameId",
      "msg": "Game ID must not be empty"
    },
    {
      "code": 6001,
      "name": "gameIdTooLong",
      "msg": "Game ID is too long"
    },
    {
      "code": 6002,
      "name": "invalidContractAddress",
      "msg": "Invalid contract address"
    },
    {
      "code": 6003,
      "name": "invalidGovernance",
      "msg": "Invalid governance address"
    },
    {
      "code": 6004,
      "name": "invalidTreasury",
      "msg": "Invalid treasury address"
    },
    {
      "code": 6005,
      "name": "invalidFactory",
      "msg": "Invalid factory address"
    },
    {
      "code": 6006,
      "name": "invalidPublisher",
      "msg": "Invalid publisher address"
    },
    {
      "code": 6007,
      "name": "invalidAdmin",
      "msg": "Invalid admin address"
    },
    {
      "code": 6008,
      "name": "invalidFeeExemptionAccount",
      "msg": "Invalid fee exemption address"
    },
    {
      "code": 6009,
      "name": "invalidRegistrationPaymentMethod",
      "msg": "Invalid registration payment method"
    },
    {
      "code": 6010,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6011,
      "name": "gameAlreadyRegistered",
      "msg": "Game is already registered"
    },
    {
      "code": 6012,
      "name": "gameNotFound",
      "msg": "Game was not found"
    },
    {
      "code": 6013,
      "name": "invalidStatus",
      "msg": "Invalid game status"
    },
    {
      "code": 6014,
      "name": "gameIdMismatch",
      "msg": "Provided game ID does not match PGC canonical game ID"
    },
    {
      "code": 6015,
      "name": "publisherMismatch",
      "msg": "Provided publisher does not match PGC canonical publisher"
    },
    {
      "code": 6016,
      "name": "registryFull",
      "msg": "Registry game limit reached"
    },
    {
      "code": 6017,
      "name": "adminListFull",
      "msg": "Registry admin limit reached"
    },
    {
      "code": 6018,
      "name": "feeExemptionListFull",
      "msg": "Registry fee exemption limit reached"
    },
    {
      "code": 6019,
      "name": "missingFeeAccounts",
      "msg": "Missing required fee accounts"
    },
    {
      "code": 6020,
      "name": "registrationFeeOptionNotFound",
      "msg": "Registration fee option was not found"
    },
    {
      "code": 6021,
      "name": "registrationFeeOptionLimitReached",
      "msg": "Registration fee option limit reached"
    },
    {
      "code": 6022,
      "name": "invalidFeePayerTokenAccount",
      "msg": "Invalid fee payer token account"
    },
    {
      "code": 6023,
      "name": "invalidTreasuryAccount",
      "msg": "Invalid treasury account"
    },
    {
      "code": 6024,
      "name": "invalidTreasuryTokenAccount",
      "msg": "Invalid treasury token account"
    },
    {
      "code": 6025,
      "name": "registrationFeeMintMismatch",
      "msg": "Registration fee mint mismatch"
    }
  ],
  "types": [
    {
      "name": "adminUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "account",
            "type": "pubkey"
          },
          {
            "name": "isAdmin",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "factoryUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldFactory",
            "type": "pubkey"
          },
          {
            "name": "newFactory",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "feeExemptionUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "account",
            "type": "pubkey"
          },
          {
            "name": "isExempt",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "gameRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "contractAddress",
            "type": "pubkey"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "registeredByFactory",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "gameStatusUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "oldStatus",
            "type": "u8"
          },
          {
            "name": "newStatus",
            "type": "u8"
          },
          {
            "name": "admin",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "governanceUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldGovernance",
            "type": "pubkey"
          },
          {
            "name": "newGovernance",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "registrationFeeOption",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentMethod",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "registrationFeeOptionEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentMethod",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "registrationFeeUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentMethod",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "enabled",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "registryGame",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "contractAddress",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "registryInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "factory",
            "type": "pubkey"
          },
          {
            "name": "registrationFeeOptions",
            "type": {
              "vec": {
                "defined": {
                  "name": "registrationFeeOptionEvent"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "registryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "factory",
            "type": "pubkey"
          },
          {
            "name": "registrationFeeOptions",
            "type": {
              "vec": {
                "defined": {
                  "name": "registrationFeeOption"
                }
              }
            }
          },
          {
            "name": "admins",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "feeExemptions",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "games",
            "type": {
              "vec": {
                "defined": {
                  "name": "registryGame"
                }
              }
            }
          },
          {
            "name": "allGameIds",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "treasuryUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldTreasury",
            "type": "pubkey"
          },
          {
            "name": "newTreasury",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
