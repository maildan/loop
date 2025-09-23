
@file:kotlin.Suppress(
  "KotlinRedundantDiagnosticSuppress",
  "LocalVariableName",
  "MayBeConstant",
  "RedundantVisibilityModifier",
  "RemoveEmptyClassBody",
  "SpellCheckingInspection",
  "LocalVariableName",
  "unused",
)

package com.google.firebase.dataconnect.generated



public interface AddReviewMutation :
    com.google.firebase.dataconnect.generated.GeneratedMutation<
      ExampleConnector,
      AddReviewMutation.Data,
      AddReviewMutation.Variables
    >
{
  
    @kotlinx.serialization.Serializable
  public data class Variables(
  
    val movieId: @kotlinx.serialization.Serializable(with = com.google.firebase.dataconnect.serializers.UUIDSerializer::class) java.util.UUID,
    val rating: Int,
    val reviewText: String
  ) {
    
    
  }
  

  
    @kotlinx.serialization.Serializable
  public data class Data(
  
    @kotlinx.serialization.SerialName("review_upsert") val key: ReviewKey
  ) {
    
    
  }
  

  public companion object {
    public val operationName: String = "AddReview"

    public val dataDeserializer: kotlinx.serialization.DeserializationStrategy<Data> =
      kotlinx.serialization.serializer()

    public val variablesSerializer: kotlinx.serialization.SerializationStrategy<Variables> =
      kotlinx.serialization.serializer()
  }
}

public fun AddReviewMutation.ref(
  
    movieId: java.util.UUID,rating: Int,reviewText: String,
  
  
): com.google.firebase.dataconnect.MutationRef<
    AddReviewMutation.Data,
    AddReviewMutation.Variables
  > =
  ref(
    
      AddReviewMutation.Variables(
        movieId=movieId,rating=rating,reviewText=reviewText,
  
      )
    
  )

public suspend fun AddReviewMutation.execute(
  
    movieId: java.util.UUID,rating: Int,reviewText: String,
  
  
  ): com.google.firebase.dataconnect.MutationResult<
    AddReviewMutation.Data,
    AddReviewMutation.Variables
  > =
  ref(
    
      movieId=movieId,rating=rating,reviewText=reviewText,
  
    
  ).execute()



// The lines below are used by the code generator to ensure that this file is deleted if it is no
// longer needed. Any files in this directory that contain the lines below will be deleted by the
// code generator if the file is no longer needed. If, for some reason, you do _not_ want the code
// generator to delete this file, then remove the line below (and this comment too, if you want).

// FIREBASE_DATA_CONNECT_GENERATED_FILE MARKER 42da5e14-69b3-401b-a9f1-e407bee89a78
// FIREBASE_DATA_CONNECT_GENERATED_FILE CONNECTOR example
